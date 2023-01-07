import s from '../../styles/slug.module.css'
import groq from 'groq'
import client from '../../client'
import { useState } from 'react'
import Result from '../../components/resultPage'
import { useForm } from 'react-hook-form'
import ClassNameHeader from '../../components/ClassNameHeader'

export default function ProfilePage({ data }) {
	const [caluculate, setCalculate] = useState([])
	const { register, handleSubmit } = useForm()
	const onSubmit = (data) => {
		setCalculate(data)
	}
	return (
		<>
			{caluculate == false ? (
				<form
					className={s.container}
					onSubmit={handleSubmit(onSubmit)}>
					<ClassNameHeader text={data.className} />
					<div className={s.inputWrapper}>
						{data.classes?.map((item) => {
							return (
								<div
									key={item._key}
									className={s.inputContainer}>
									<p>
										Jeg har deltat på
										<input
											className={s.input}
											key={item._id}
											type='number'
											{...register(item.name)}
										/>
										av {item.class} {item.name}
									</p>
								</div>
							)
						})}
					</div>
					<input
						className={s.button}
						type='submit'
					/>
				</form>
			) : (
				<>
					<Result
						userInput={caluculate}
						classesValue={data.classes}
					/>
				</>
			)}
		</>
	)
}

export async function getStaticPaths() {
	const respon = await client.fetch(groq`*[_type == 'data']`)

	const paths = respon.map((item) => {
		return {
			params: { slug: item.slug.current },
		}
	})

	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps(connumber) {
	const { slug = '' } = connumber.params
	const data = await client.fetch(
		`
    *[_type == "data" && slug.current == $slug][0]{name, slug, className, code, classes}
  `,
		{ slug }
	)
	return {
		props: {
			data,
		},
	}
}
