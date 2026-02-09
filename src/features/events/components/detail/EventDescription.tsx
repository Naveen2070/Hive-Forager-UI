export const EventDescription = ({ description }: { description: string }) => {
  return (
    <div className="prose prose-invert prose-blue max-w-none">
      <h3 className="text-xl font-semibold text-slate-100 mb-4">
        About this Event
      </h3>
      <p className="text-slate-300 whitespace-pre-line leading-relaxed">
        {description}
      </p>
    </div>
  )
}
